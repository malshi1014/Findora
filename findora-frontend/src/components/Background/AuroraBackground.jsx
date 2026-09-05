import React, { useEffect, useRef } from "react";

function AuroraBackground() {
  const glowRef = useRef(null);

  useEffect(() => {
    // Only track mouse on devices that support hover
    const matchMedia = window.matchMedia("(pointer: fine)");
    if (!matchMedia.matches) return;

    let requestRef;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth interpolation for fluid organic feel
      glowX += (mouseX - glowX) * 0.05;
      glowY += (mouseY - glowY) * 0.05;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      }
      requestRef = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    requestRef = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return (
    <div className="aurora-container">
      <div className="aurora-blob aurora-blob-1"></div>
      <div className="aurora-blob aurora-blob-2"></div>
      <div className="aurora-blob aurora-blob-3"></div>
      
      {/* Subtle Interactive Mouse Glow */}
      <div ref={glowRef} className="aurora-mouse-glow hidden sm:block"></div>
      
      {/* Optional subtle dot overlay to add texture/premium feel */}
      <div className="aurora-overlay"></div>
    </div>
  );
}

export default AuroraBackground;
