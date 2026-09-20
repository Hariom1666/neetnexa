import Link from "next/link";

export default function Dashboard() {
  const chapters = [
    // PHYSICS (Updated with Experimental Skills)
    { name: "Physics and Measurement", subject: "Physics" },
    { name: "Kinematics", subject: "Physics" },
    { name: "Laws of Motion", subject: "Physics" },
    { name: "Work, Energy, and Power", subject: "Physics" },
    { name: "Rotational Motion", subject: "Physics" },
    { name: "Gravitation", subject: "Physics" },
    { name: "Properties of Solids and Liquids", subject: "Physics" },
    { name: "Thermodynamics", subject: "Physics" },
    { name: "Kinetic Theory of Gases", subject: "Physics" },
    { name: "Oscillations and Waves", subject: "Physics" },
    { name: "Electrostatics", subject: "Physics" },
    { name: "Current Electricity", subject: "Physics" },
    { name: "Magnetic Effects of Current and Magnetism", subject: "Physics" },
    { name: "Electromagnetic Induction and Alternating Currents", subject: "Physics" },
    { name: "Electromagnetic Waves", subject: "Physics" },
    { name: "Optics", subject: "Physics" },
    { name: "Dual Nature of Matter and Radiation", subject: "Physics" },
    { name: "Atoms and Nuclei", subject: "Physics" },
    { name: "Electronic Devices", subject: "Physics" },
    { name: "Experimental Skills", subject: "Physics" },

    // CHEMISTRY (Updated with Practical & Purification units)
    { name: "Some Basic Concepts of Chemistry", subject: "Chemistry" },
    { name: "Structure of Atom", subject: "Chemistry" },
    { name: "Classification of Elements and Periodicity", subject: "Chemistry" },
    { name: "Chemical Bonding and Molecular Structure", subject: "Chemistry" },
    { name: "Chemical Thermodynamics", subject: "Chemistry" },
    { name: "Equilibrium", subject: "Chemistry" },
    { name: "Redox Reactions", subject: "Chemistry" },
    { name: "Solutions", subject: "Chemistry" },
    { name: "Electrochemistry", subject: "Chemistry" },
    { name: "Chemical Kinetics", subject: "Chemistry" },
    { name: "p-Block Elements", subject: "Chemistry" },
    { name: "d- and f-Block Elements", subject: "Chemistry" },
    { name: "Coordination Compounds", subject: "Chemistry" },
    { name: "Purification and Characterisation of Organic Compounds", subject: "Chemistry" },
    { name: "Some Basic Principles of Organic Chemistry", subject: "Chemistry" },
    { name: "Hydrocarbons", subject: "Chemistry" },
    { name: "Organic Compounds Containing Halogens", subject: "Chemistry" },
    { name: "Organic Compounds Containing Oxygen", subject: "Chemistry" },
    { name: "Organic Compounds Containing Nitrogen", subject: "Chemistry" },
    { name: "Biomolecules", subject: "Chemistry" },
    { name: "Principles Related to Practical Chemistry", subject: "Chemistry" },

    // BIOLOGY (NMC 10 Core Units)
    { name: "Diversity in Living World", subject: "Biology" },
    { name: "Structural Organisation in Animals and Plants", subject: "Biology" },
    { name: "Cell Structure and Function", subject: "Biology" },
    { name: "Plant Physiology", subject: "Biology" },
    { name: "Human Physiology", subject: "Biology" },
    { name: "Reproduction", subject: "Biology" },
    { name: "Genetics and Evolution", subject: "Biology" },
    { name: "Biology and Human Welfare", subject: "Biology" },
    { name: "Biotechnology and Its Applications", subject: "Biology" },
    { name: "Ecology and Environment", subject: "Biology" }
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "2px solid #f0f0f0", paddingBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#1a1a1a" }}>Neet Nexa Dashboard</h1>
        <div style={{ fontWeight: "bold", color: "#4a4a4a" }}>Target: NEET 2026</div>
      </div>
      
      <h2 style={{ color: "#333", marginBottom: "30px" }}>Select a Chapter to Practice</h2>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "20px" 
      }}>
        {chapters.map((chapter, index) => (
          <Link 
            key={index} 
            href={`/tests/${encodeURIComponent(chapter.name)}`}
            style={{ 
              display: "block", 
              padding: "24px", 
              border: "1px solid #e0e0e0", 
              borderRadius: "12px", 
              textDecoration: "none", 
              color: "inherit",
              background: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
          >
            <div style={{ 
              fontSize: "12px", 
              color: chapter.subject === "Physics" ? "#0066cc" : chapter.subject === "Chemistry" ? "#cc0066" : "#009933", 
              marginBottom: "8px", 
              textTransform: "uppercase", 
              fontWeight: "bold",
              letterSpacing: "0.5px"
            }}>
              {chapter.subject}
            </div>
            <div style={{ fontSize: "18px", fontWeight: "600", lineHeight: "1.4" }}>
              {chapter.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}