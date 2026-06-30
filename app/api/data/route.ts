import { prisma } from "@/lib/prisma";

export async function GET() {
	const items = await prisma.submittedData.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return Response.json({ items });
}

export async function POST(request: Request) {
	const body: unknown = await request.json().catch(() => null);

	if (
		!body ||
		typeof body !== "object" ||
		!("text" in body) ||
		typeof body.text !== "string" ||
		body.text.trim().length === 0
	) {
		return Response.json(
			{ error: "text is required." },
			{
				status: 400,
			},
		);
	}

	const item = await prisma.submittedData.create({
		data: {
			text: body.text.trim(),
		},
	});

	return Response.json({ item }, { status: 201 });
}

export async function DELETE() {
	const result = await prisma.submittedData.deleteMany();

	return Response.json({ deletedCount: result.count });
}
