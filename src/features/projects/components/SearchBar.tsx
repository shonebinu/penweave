import { Search } from "lucide-react";

import { useState } from "react";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder = "Search",
}: {
  searchQuery: string;
  setSearchQuery: (newQuery: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(searchQuery);

  const handleSubmit = () => setSearchQuery(query);

  return (
    <div className="mb-5">
      <div className="join">
        <label className="input join-item">
          <Search size=".8rem" className="opacity-50" />
          <input
            type="search"
            required
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
        </label>
        <button className="btn join-item" onClick={handleSubmit}>
          Search
        </button>
      </div>
    </div>
  );
}
