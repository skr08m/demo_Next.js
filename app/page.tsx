"use client";

import { FormEvent, useState } from "react";

type SubmittedData = {
	id: number;
	text: string;
};

export default function Home() {
	const [text, setText] = useState("");
	const [items, setItems] = useState<SubmittedData[]>([]);

	const loadItems = async () => {
		const response = await fetch("/api/data", {
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error("Failed to load data.");
		}

		const data = await response.json();
		setItems(data.items);
	};

	const submitData = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!text.trim()) {
			return;
		}

		const response = await fetch("/api/data", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			throw new Error("Failed to save data.");
		}

		setText("");
		await loadItems();
	};

	const deleteAllItems = async () => {
		const response = await fetch("/api/data", {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error("Failed to delete data.");
		}

		setItems([]);
	};

	return (
		<main>
			<h1>Data Storage</h1>

			<form onSubmit={submitData}>
				<input
					value={text}
					onChange={(event) => setText(event.target.value)}
					placeholder="Text"
				/>

				<button type="submit">Save</button>

				<button type="button" onClick={deleteAllItems}>
					Delete All
				</button>

				<button type="button" onClick={loadItems}>
					Get Data
				</button>
			</form>

			<ul>
				{items.map((item) => (
					<li key={item.id}>{item.text}</li>
				))}
			</ul>
		</main>
	);
}
