"use client";
import css from "./TagsMenu.module.css";
import Link from "next/link";
import { useState } from "react";

export default function TagsMenu() {
  const tags: string[] = [
    "All",
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
  ];
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  return (
    <div className={css.menuContainer}>
      <button
        className={css.menuButton}
        onClick={() => setIsOpenFilter(!isOpenFilter)}
      >
        Notes ▾
      </button>
      {isOpenFilter && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li className={css.menuItem} key={tag}>
              <Link
                href={`/notes/filter/${tag}`}
                className={css.menuLink}
                onClick={() => setIsOpenFilter(false)}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
