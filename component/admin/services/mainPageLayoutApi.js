import { handleExpiredAdminSession } from "./adminSession";

const API_BASE =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ADMIN_API_URL) ||
  "http://localhost:5000";

function getAuthHeaders(json = false) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function revalidateHomePage() {
  try {
    const response = await fetch("/api/revalidate-home", {
      method: "POST",
    });
    if (!response.ok) {
      console.error("Failed to revalidate home page cache.", response.status);
    }
  } catch {
    console.error("Failed to revalidate home page cache.");
  }
}

function sortByHomepageOrder(items) {
  return [...items].sort((firstItem, secondItem) => {
    const firstOrder =
      Number.isInteger(firstItem?.homepageOrder) && firstItem.homepageOrder > 0
        ? firstItem.homepageOrder
        : Number.MAX_SAFE_INTEGER;
    const secondOrder =
      Number.isInteger(secondItem?.homepageOrder) &&
      secondItem.homepageOrder > 0
        ? secondItem.homepageOrder
        : Number.MAX_SAFE_INTEGER;
    return firstOrder - secondOrder;
  });
}

function normalizeAssetUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return typeof value === "string" && value.startsWith("data:") ? "" : value;
  }

  return `${API_BASE}${value}`;
}

function normalizeSectionItem(section, item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  if (section === "banner") {
    return {
      ...item,
      poster: normalizeAssetUrl(item.poster),
    };
  }

  if (
    section === "projects" ||
    section === "breakdown" ||
    section === "video"
  ) {
    return {
      ...item,
      thumbnail: normalizeAssetUrl(item.thumbnail),
      ...(section === "projects"
        ? {
            characters: Array.isArray(item.characters)
              ? item.characters
                  .map((character) => {
                    const baseCharacter =
                      character &&
                      typeof character === "object" &&
                      !Array.isArray(character)
                        ? character
                        : {};

                    return {
                      ...baseCharacter,
                      name:
                        typeof character?.name === "string"
                          ? character.name
                          : "",
                      image: normalizeAssetUrl(character?.image),
                    };
                  })
                  .filter((character) => character.name && character.image)
              : [],
          }
        : {}),
    };
  }

  if (section === "catalogues") {
    return {
      ...item,
      image: normalizeAssetUrl(item.image),
    };
  }

  if (section === "blog") {
    const firstImage =
      Array.isArray(item.image) && item.image.length > 0
        ? normalizeAssetUrl(item.image[0])
        : "";

    return {
      ...item,
      image: Array.isArray(item.image)
        ? item.image
            .map((imageItem) => normalizeAssetUrl(imageItem))
            .filter(Boolean)
        : [],
      images: firstImage,
    };
  }

  return item;
}

export async function fetchMainPageLayoutItems(section, { signal } = {}) {
  const response = await fetch(
    `${API_BASE}/api/admin/main-page-layout/${section}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      items: [],
      message: data?.message || "Failed to load main page layout items.",
      status: response.status,
    };
  }

  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : [];

  return {
    ok: true,
    items: rawItems
      .map((item) => normalizeSectionItem(section, item))
      .filter(Boolean),
    message: "",
    status: response.status,
  };
}

export async function fetchPublicMainPageLayoutItems(section) {
  const response = await fetch(
    `${API_BASE}/api/admin/public/main-page-layout/${section}`,
    {
      method: "GET",
      cache: "force-cache",
    }
  );
  const data = await response.json();
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : [];
  const normalizedItems = rawItems
    .map((item) => normalizeSectionItem(section, item))
    .filter(Boolean)
    .filter((item) => item.showInHomepage === true);

  return sortByHomepageOrder(normalizedItems);
}

export async function fetchPublicAllVideos() {
  const response = await fetch(`${API_BASE}/api/admin/public/videos`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await readJson(response);

  const rawVideos = Array.isArray(data?.videos) ? data.videos : [];
  return rawVideos.map((video) => ({
    ...video,
    thumbnail: normalizeAssetUrl(video.thumbnail),
  }));
}

export async function updateMainPageLayoutItem(
  section,
  id,
  body,
  { signal } = {}
) {
  const response = await fetch(
    `${API_BASE}/api/admin/main-page-layout/${section}/${id}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(true),
      body: JSON.stringify(body || {}),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      item: null,
      message: data?.message || "Failed to update main page layout item.",
      status: response.status,
    };
  }

  await revalidateHomePage();

  return {
    ok: true,
    item: normalizeSectionItem(section, data?.item),
    message: "",
    status: response.status,
  };
}

export async function updateMainPageLayoutSection(
  section,
  orderedIds,
  { signal, projectId } = {}
) {
  const response = await fetch(
    `${API_BASE}/api/admin/main-page-layout/${section}`,
    {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify({
        orderedIds: Array.isArray(orderedIds) ? orderedIds : [],
        ...(typeof projectId === "string" && projectId.trim()
          ? { projectId: projectId.trim() }
          : {}),
      }),
      signal,
    }
  );
  const data = await readJson(response);

  if (!response.ok) {
    handleExpiredAdminSession(response.status);
    return {
      ok: false,
      items: [],
      message: data?.message || "Failed to update main page layout section.",
      status: response.status,
    };
  }

  await revalidateHomePage();

  const rawItems = Array.isArray(data?.items) ? data.items : [];

  return {
    ok: true,
    items: rawItems
      .map((item) => normalizeSectionItem(section, item))
      .filter(Boolean),
    message: "",
    status: response.status,
  };
}
