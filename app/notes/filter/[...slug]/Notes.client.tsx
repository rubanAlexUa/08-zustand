"use client";
import c from "./App.module.css";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import { fetchNotes } from "@/lib/api";

type Props = {
  tag: string | undefined;
};

export default function NotesClient({ tag }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const { data } = useQuery({
    queryKey: ["note", query, page, tag],
    queryFn: () => fetchNotes({ query, page, tag }),
    placeholderData: keepPreviousData,
  });

  function onClose() {
    setIsModalOpened(false);
  }

  const totalPages = data?.totalPages ?? 0;

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setPage(1);
    },
    1000
  );
  return (
    <div className={c.app}>
      <header className={c.toolbar}>
        <SearchBox query={query} handleChange={handleChange} />
        {data && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            changePage={setPage}
          />
        )}
        <button className={c.button} onClick={() => setIsModalOpened(true)}>
          Create note +
        </button>
      </header>
      {data && <NoteList notes={data.notes}></NoteList>}
      {isModalOpened && (
        <Modal onClose={onClose}>
          <NoteForm onClose={onClose}></NoteForm>
        </Modal>
      )}
    </div>
  );
}
