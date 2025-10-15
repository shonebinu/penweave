import { Search } from "lucide-react";

export function ProjectsFilter() {
  return (
    <>
      <div className="mb-5 flex justify-between gap-3">
        <label className="input">
          <Search size=".8rem" className="opacity-50" />
          <input type="search" required placeholder="Search" />
        </label>

        <select className="select w-40">
          <option disabled>Sort by</option>
          <option>Recently Updated</option>
          <option>Recently Created</option>
          <option>Most Forked</option>
          <option>Most Liked</option>
        </select>
      </div>

      <form className="mb-5 flex flex-wrap gap-1">
        <input
          className="btn"
          type="checkbox"
          name="visibility"
          aria-label="Public"
        />
        <input
          className="btn"
          type="checkbox"
          name="visibility"
          aria-label="Private"
        />

        <input
          className="btn"
          type="checkbox"
          name="type"
          aria-label="Forked"
        />
        <input
          className="btn"
          type="checkbox"
          name="type"
          aria-label="Originals"
        />

        <input className="btn btn-square" type="reset" value="×" />
      </form>
    </>
  );
}
