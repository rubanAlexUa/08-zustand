import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function Notes({ params }: Props) {
  const query = "";
  const page = 1;
  const queryClient = new QueryClient();
  const { slug } = await params;
  const tag = slug[0] == "All" ? undefined : slug[0];
  await queryClient.prefetchQuery({
    queryKey: ["note", query, page, tag],
    queryFn: () => fetchNotes({ query, page, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
