"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthInfo } from '@/../../components/types';

export default function CreateAccount() {
  const [info, setInfo] = useState<AuthInfo>({ email: "", password: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;
    setInfo((old) => ({
      ...old,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (info.password2 == info.password) {

      const res = await fetch("/api/create", {
        method: "POST",
        body: JSON.stringify({ email: info.email, password: info.password }),
      });

      const { success, message } = await res.json();
      if (success) {
        router.push("/");
        router.refresh();
      } else {
        setLoading(false);
        alert(message)
      }
    } else {
      alert("Senhas não coincidem")
      setLoading(false);
    }
  };

  return (
    <main className="md:min-h-screen text-center text-black md:bg-white md:flex md:items-center md:justify-center">
      <section className="bg-white absolute top-0 bottom-0 md:static md:border md:rounded-lg md:shadow-lg flex flex-col justify-center py-12 px-6 md:px-2 w-full md:w-1/2">
        <h1 className="text-2xl font-bold mb-4">
          Criar conta
        </h1>
        <form onSubmit={handleSubmit} className='text-black mx-auto '>
          <section className="flex-row justify-center items-center">
            <section className="w-5/6">
              <label className="me-1 font-bold" htmlFor="email">Email:</label>
              <input className="mb-5 border ps-1 w-7/12" required id='email' onChange={handleChange} value={info.email.length === 0 ? '' : info.email} />
            </section>
            <section className="w-5/6" >
              <label className="me-1 font-bold" htmlFor="password">Senha:</label>
              <input className="mb-5 border ps-1 w-7/12" type='password' required id='password' onChange={handleChange} value={info.password.length === 0 ? '' : info.password} />
            </section>
            <section className="w-5/6" >
              <label className="me-1 font-bold" htmlFor="password2">Confirme a senha:</label>
              <input className="mb-5 border ps-1 w-7/12" type='password' required id='password2' onChange={handleChange} value={info.password2?.length === 0 ? '' : info.password2} />
            </section>
          </section>
          <section className='mb-2'>
            <button type='submit' className="bg-purple-600 hover:bg-purple-800 text-white py-1 px-10 rounded">
              {loading ? 'Carregando...' : 'Criar Conta'}
            </button></section>
        </form>
      </section>
    </main>
  );
}
