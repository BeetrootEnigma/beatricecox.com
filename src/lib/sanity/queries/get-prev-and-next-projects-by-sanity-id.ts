import { getClient } from "@/lib/sanity/client";
import { Project } from "@/types/global";

const orderedProjectsNavQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  category,
  categoryText,
  order
}`;

interface SanityProjectNavRow {
  _id: string;
  title?: string;
  slug?: { current: string };
  category?: string;
  categoryText?: string;
  order?: number;
}

export interface GetPrevAndNextProjectsBySanityIdParams {
  sanityId: string;
  isPreview?: boolean;
}

export type GetPrevAndNextProjectsBySanityIdResponse = {
  prevProject: Pick<Project, "title" | "slug" | "category" | "categoryText">;
  nextProject: Pick<Project, "title" | "slug" | "category" | "categoryText">;
};

function toNavPick(
  row: SanityProjectNavRow
): Pick<Project, "title" | "slug" | "category" | "categoryText"> {
  return {
    title: row.title,
    slug: row.slug?.current,
    categoryText: row.categoryText,
    category: row.category,
  };
}

export async function getPrevAndNextProjectsBySanityId({
  sanityId,
  isPreview = false,
}: GetPrevAndNextProjectsBySanityIdParams): Promise<GetPrevAndNextProjectsBySanityIdResponse> {
  try {
    const client = getClient(isPreview);
    const rows = await client.fetch<SanityProjectNavRow[]>(
      orderedProjectsNavQuery
    );

    const sorted = [...(rows ?? [])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    const n = sorted.length;

    if (n === 0) {
      return { prevProject: {}, nextProject: {} };
    }

    const i = sorted.findIndex((p) => p._id === sanityId);
    if (i === -1) {
      throw new Error(`Project not found in ordered list: ${sanityId}`);
    }

    const prevRow = sorted[(i - 1 + n) % n];
    const nextRow = sorted[(i + 1) % n];

    return {
      prevProject: toNavPick(prevRow),
      nextProject: toNavPick(nextRow),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch adjacent projects", { cause: error });
  }
}
