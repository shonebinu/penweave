import { Globe2, Search } from "lucide-react";

import { useState } from "react";

export default function ExploreHeader({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (newQuery: string) => void;
}) {
  const [query, setQuery] = useState(searchQuery);
  return (
    <>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Globe2 />
        Explore
      </h1>
      <p className="text-base-content/80 mb-3 text-sm">
        Browse and discover new ideas.
      </p>

      <div className="mb-5">
        <div className="join">
          <label className="input join-item">
            <Search size=".8rem" className="opacity-50" />
            <input
              type="search"
              required
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchQuery(query);
              }}
            />
          </label>
          <button
            className="btn join-item"
            onClick={() => setSearchQuery(query)}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
}
