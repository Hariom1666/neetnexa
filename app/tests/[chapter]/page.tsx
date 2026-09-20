"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ChapterTest() {
  const params = useParams();
  const rawChapter = params?.chapter as string;
  const chapterName = rawChapter ? decodeURIComponent(rawChapter) : "";

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  // NEW: State for Student Name and saving status
  const [studentName, setStudentName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      if (!chapterName) return;
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('chapter_name', chapterName); 
        
      if (data) {
        setQuestions(data);
      }
      setIsLoading(false);
    }
    fetchQuestions();
  }, [chapterName]);

  // NEW: Start Test Handler
  const handleStart = () => {
    if (studentName.trim() === "") {
      alert("Please enter your name to start the test!");
      return;
    }
    setHasStarted(true);
  };

  const handleAnswer = async (selectedOption: string) => {
    const currentQ = questions[currentQIndex];
    const isCorrect = selectedOption === currentQ.correct_answer;
    
    // Calculate new score (+4 for correct, -1 for incorrect)
    const newScore = isCorrect ? score + 4 : score - 1;
    setScore(newScore);

    setUserAnswers([
      ...userAnswers, 
      {
        questionObj: currentQ,
        selected: selectedOption,
        isCorrect: isCorrect
      }
    ]);

    const nextQuestion = currentQIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQIndex(nextQuestion);
    } else {
      setShowResults(true);
      
      // NEW: Securely save the final score to the Supabase database
      setIsSaving(true);
      const { error } = await supabase
        .from('test_results')
        .insert([{
          student_name: studentName,
          chapter_name: chapterName,
          score: newScore,
          total_question: questions.length // Matches your exact column name
        }]);
        
      if (error) {
        console.error("Error saving score:", error.message);
      }
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading test...</div>;
  }

  if (questions.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center" }}>No questions uploaded for <b>{chapterName}</b> yet.</div>;
  }

  // NEW: Pre-test Name Entry Screen
  if (!hasStarted) {
    return (
      <div style={{ maxWidth: "500px", margin: "80px auto", padding: "40px 30px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1 style={{ fontSize: "24px", color: "#0f172a", marginBottom: "10px" }}>{chapterName}</h1>
        <p style={{ color: "#64748b", marginBottom: "30px", fontSize: "15px" }}>
          This test contains {questions.length} questions.<br/>Scoring: +4 for correct, -1 for incorrect.
        </p>
        
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "16px", marginBottom: "20px", textAlign: "center", outlineColor: "#2563eb" }}
        />
        <button 
          onClick={handleStart}
          style={{ width: "100%", padding: "14px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
        >
          Start Practice
        </button>
      </div>
    );
  }

  if (showResults) {
    return (
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Test Complete: {chapterName}</h2>
        <div style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "10px", color: score > 0 ? "#009933" : "#cc0000" }}>
          Final Score: {score} / {questions.length * 4}
        </div>
        
        <div style={{ textAlign: "center", marginBottom: "40px", color: "#64748b", fontSize: "14px", fontStyle: "italic" }}>
          {isSaving ? "Saving your score to the database..." : "✅ Score saved successfully!"}
        </div>

        <h3 style={{ marginBottom: "20px" }}>Review Your Answers, {studentName}:</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {userAnswers.map((ans, index) => (
            <div 
              key={index} 
              style={{ 
                padding: "20px", 
                border: "1px solid", 
                borderColor: ans.isCorrect ? "#b2f2bb" : "#ffc9c9",
                borderRadius: "8px", 
                backgroundColor: ans.isCorrect ? "#f4fce3" : "#fff5f5" 
              }}
            >
              <p style={{ fontWeight: "bold", margin: "0 0 15px 0" }}>
                Q{index + 1}: {ans.questionObj.question_text}
              </p>
              
              <div style={{ margin: "5px 0", color: ans.isCorrect ? "#2b8a3e" : "#c92a2a", fontWeight: "500" }}>
                Your Answer: {ans.selected} {ans.isCorrect ? "✅" : "❌"}
              </div>
              
              {!ans.isCorrect && (
                <div style={{ margin: "10px 0 0 0", color: "#2b8a3e", fontWeight: "600", padding: "10px", backgroundColor: "#e3fafc", borderRadius: "6px" }}>
                  Correct Answer: {ans.questionObj.correct_answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link href="/dashboard" style={{ display: "inline-block", padding: "14px 28px", background: "#0066cc", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "bold" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const options = [currentQ.option_a, currentQ.option_b, currentQ.option_c, currentQ.option_d];

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "20px", margin: 0, color: "#333" }}>{chapterName}</h1>
        <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>Question {currentQIndex + 1} of {questions.length}</span>
      </div>
      
      <h2 style={{ marginBottom: "30px", lineHeight: "1.4" }}>{currentQ.question_text}</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {options.map((option, index) => (
          <button 
            key={index}
            onClick={() => handleAnswer(option)}
            style={{ padding: "16px", border: "1px solid #d9d9d9", borderRadius: "8px", cursor: "pointer", textAlign: "left", background: "white", fontSize: "16px", transition: "background 0.2s" }}
            onMouseOver={(e) => e.currentTarget.style.background = "#f5f5f5"}
            onMouseOut={(e) => e.currentTarget.style.background = "white"}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}