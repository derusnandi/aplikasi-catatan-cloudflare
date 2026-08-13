// Cloudflare Pages Function - Backend API with SQL Database (Cloudflare D1)

export async function onRequestGet(context) {
  const { env } = context;
  try {
    // Kueri SQL SELECT standar
    const { results } = await env.DB.prepare(
      "SELECT * FROM notes ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const { title, content } = data;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: "Judul dan isi wajib diisi" }), { status: 400 });
    }

    // Kueri SQL INSERT INTO standar
    await env.DB.prepare(
      "INSERT INTO notes (title, content, created_at) VALUES (?, ?, ?)"
    ).bind(title, content, new Date().toISOString()).run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID wajib diisi" }), { status: 400 });
    }

    // Kueri SQL DELETE FROM standar
    await env.DB.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
