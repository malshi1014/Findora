import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import sriLankaTowns from "../data/sriLankaTowns";

/**
 * A searchable town dropdown.
 * @param {string} value - Currently selected town
 * @param {function} onChange - Called with the selected town string
 * @param {string[]} [towns] - Optional filtered list of towns. Falls back to the full list.
 * @param {string} [placeholder]
 * @param {boolean} [hasIcon]
 * @param {boolean} [disabled] - Disables the input (e.g. when no district selected)
 * @param {string} [className] - Extra classes for the input
 */
function TownSelect({
  value,
  onChange,
  towns,
  placeholder = "Select nearest town",
  hasIcon = true,
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const townList = towns || sriLankaTowns;

  const filteredTowns = townList.filter((town) =>
    town.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear selection when town list changes (district changed)
  useEffect(() => {
    if (towns && value && !towns.includes(value)) {
      onChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [towns]);

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm("");
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {hasIcon && (
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
      )}
      <input
        type="text"
        placeholder={disabled ? "Select a district first" : placeholder}
        value={isOpen ? searchTerm : value}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onClick={handleOpen}
        readOnly={disabled}
        className={`w-full ${hasIcon ? "pl-9" : "px-4"
          } pr-3 py-3 text-sm rounded-3xl border border-slate-200 outline-none transition ${disabled
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:bg-white cursor-pointer"
          }`}
      />

      {isOpen && !disabled && (
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
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition ${value === town
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-slate-700"
                  }`}
              >
                {town}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">
              No towns found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TownSelect;
