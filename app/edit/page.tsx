"use client"
import React, { useRef, useState } from "react";

interface Tag {
  tagId: number;
  data: string;
}

export default function Edit() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([
    { tagId: 1, data: "sala 502" },
    { tagId: 2, data: "primeiro andar" },
    { tagId: 3, data: "sala 808" }
  ]);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleEditClick = (index: number) => {
    const inputElement = inputRefs.current[index];
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setTags(prevTags =>
      prevTags.map((tag, i) =>
        i === index ? { ...tag, data: value } : tag
      )
    );
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
      alert("Informações salvas com sucesso")
      setLoading(false)
    } else {
      setLoading(false);
      alert(message);
    }
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
      <h2 className="mt-5 text-3xl mb-5">{'Editar tags'}</h2>
      <div className="mx-auto w-5/6 border border-black flex-row text-center ">
        {sections}
      </div>
      <button
        className="p-2 bg-gray-300 border border-black mt-5"
        onClick={handleSave}
      >
        {loading ? 'Carregando...' : 'Salvar'}
      </button>
    </section>
  );
}

