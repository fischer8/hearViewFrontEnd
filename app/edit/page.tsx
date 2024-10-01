"use client";
import React, { useRef, useState, useEffect } from "react";

interface Tag {
  tagId: number;
  data: string;
}

export default function Edit() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/get-tag", {
          method: "GET",
        });
        const result = await res.json();
        if (result.success) {
          // Adiciona um tagId baseado no índice do array
          const tagsWithIds = result.data.map((tag: { data: string }, index: number) => ({
            tagId: index + 1,  // Define o tagId como o índice + 1
            data: tag.data,
          }));
          setTags(tagsWithIds); // Atualiza o estado com os dados recebidos
        } else {
          console.error("Failed to fetch tags:", result.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleEditClick = (index: number) => {
    const inputElement = inputRefs.current[index];
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setTags((prevTags) =>
      prevTags.map((tag, i) =>
        i === index ? { ...tag, data: value } : tag
      )
    );
  };

  const createTag = () => {
    setTags((prevTags) => {
      const newTagId = prevTags.length + 1; // Define o tagId com base no número de elementos no array
      return [...prevTags, { tagId: newTagId, data: "" }];
    });
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const res = await fetch("/api/tag", {
      method: "POST",
      body: JSON.stringify(tags),
    });

    const { success, message } = await res.json();
    if (success) {
      alert("Informações salvas com sucesso");
    } else {
      alert(message);
    }
    setLoading(false);
  };

  const sections = tags.map((item, index) => (
    <section className="border border-black p-6" key={item.tagId}>
      <section className="flex justify-evenly">
        <button
          className="block bg-gray-300 p-2"
          onClick={() => handleEditClick(index)}
        >
          Editar
        </button>
        <section className="flex w-5/6 justify-between">
          <p>tag{item.tagId}</p>
          <input
            ref={(el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            }}
            value={item.data}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </section>
      </section>
    </section>
  ));

  return (
    <section className="text-center">
      <h2 className="mt-5 text-3xl mb-5">{"Editar tags"}</h2>
      <div className="mx-auto w-5/6 border border-black flex-row text-center ">
        {loading ? "Carregando..." : sections}
      </div>
      <button
        className="p-2 bg-gray-300 border border-black mt-5"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Carregando..." : "Salvar"}
      </button>
      <button
        className="p-2 ms-2 bg-gray-300 border border-black mt-5"
        onClick={createTag}
        disabled={loading}
      >
        {"+ Adicionar Tag"}
      </button>
    </section>
  );
}

