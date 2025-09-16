"use client";

import c from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import type { NoteFormValues } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const initialValues: NoteFormValues = {
    title: draft.title || "",
    content: draft.content || "",
    tag: draft.tag || "Todo",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title is too long")
      .required("Title is required"),
    content: Yup.string().max(500, "Content is too long"),
    tag: Yup.string().oneOf([
      "Todo",
      "Work",
      "Personal",
      "Meeting",
      "Shopping",
    ]),
  });

  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      console.log("New note added");
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    createNoteMutation.mutate(values);
    clearDraft();
    actions.resetForm();
    router.back();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange }) => {
        const syncChange = (
          e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >
        ) => {
          handleChange(e); // Formik
          setDraft({ ...draft, [e.target.name]: e.target.value }); // Zustand
        };

        return (
          <Form className={c.form}>
            <Field
              id="title"
              name="title"
              type="text"
              className={c.input}
              onChange={syncChange}
            />
            <ErrorMessage name="title" component="span" className={c.error} />

            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={c.textarea}
              onChange={syncChange}
            />
            <ErrorMessage name="content" component="span" className={c.error} />

            <Field
              as="select"
              id="tag"
              name="tag"
              className={c.select}
              onChange={syncChange}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={c.error} />

            <div className={c.actions}>
              <button
                type="button"
                onClick={() => router.back()}
                className={c.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" className={c.submitButton}>
                Create note
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
