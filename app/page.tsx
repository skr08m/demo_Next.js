"use client";

import { FormEvent, useEffect, useState } from "react";

//変数のまとまり定義
type SubmittedData = {
	id: number;
	text: string;
};

//Reactては、関数の中に処理内容、見た目の情報を入れて1まとまりとして扱う
export default function Home() {
	//変更を検知する変数定義
	//const [現在の値, 更新関数] = useState<型>(初期値); ※型は推論可能であれば省略可能
	const [text, setText] = useState("");
	const [items, setItems] = useState<SubmittedData[]>([]);

	//APIで情報の取得を行う関数
	const loadItems = async () => {
		const response = await fetch("/api/data");
		const data = await response.json();
		setItems(data.items);
	};

	//データをPOSTで送信する関数
	const submitData = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!text.trim()) {
			return;
		}

		await fetch("/api/data", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text }),
		});

		setText("");
		await loadItems();
	};

	//useEffect()は、画面描画後のはじめの一回だけ処理するための関数
	useEffect(() => {
		loadItems();
	}, []);

	//return文の中は、基本的にHTMLの返却
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
			</form>

			<ul>
				{items.map((item) => (
					<li key={item.id}>{item.text}</li>
				))}
			</ul>
		</main>
	);
}
