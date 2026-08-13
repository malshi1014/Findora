import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import sriLankaTowns from "../data/sriLankaTowns";

function TownSelect({ value, onChange, placeholder = "e.g. Colombo", hasIcon = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredTowns = sriLankaTowns.filter((town) =>
    town.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {hasIcon && <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input
        type="text"
        placeholder={placeholder}
        value={isOpen ? searchTerm : value}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onClick={() => setIsOpen(true)}
        className={`w-full ${
          hasIcon ? "pl-9" : "px-4"
        } pr-3 py-3 text-sm rounded-3xl border border-slate-200 bg-slate-50 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:bg-white`}
      />

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto overflow-hidden">
          {filteredTowns.length > 0 ? (
            filteredTowns.map((town) => (
              <button
                key={town}
                type="button"
                onClick={() => {
                  onChange(town);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition ${
                  value === town ? "bg-blue-100 text-blue-700 font-medium" : "text-slate-700"
                }`}
              >
                {town}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">No towns found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default TownSelect;
