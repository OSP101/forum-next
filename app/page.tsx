'use client'
import { useState, useEffect } from 'react'
import ForumPage from '@/components/ForumPage';
import axios from 'axios'
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface Forum {
  id: number
  author: string
  detail: string
  love: number
  date: string
}

interface ForumResponse {
  data: Forum[]
  length: number
}

export default function Home() {
  const [forums, setForums] = useState<ForumResponse>({ data: [], length: 0 })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [formData, setFormData] = useState({
    author: '',
    detail: '',
  })


  const validateApiResponse = (data: any) => {
    const errors: string[] = []

    if (!data.data || !Array.isArray(data.data)) {
      errors.push("Invalid data structure")
      return { isValid: false, errors }
    }

    if (typeof data.data[0].id !== 'number') {
      errors.push(`Missing or invalid "id" field`)
    }
    if (typeof data.data[0].author !== 'string') {
      errors.push(`Missing or invalid "author" field`)
    }
    if (typeof data.data[0].detail !== 'string') {
      errors.push(`Missing or invalid "detail" field`)
    }
    if (typeof data.data[0].love !== 'number') {
      errors.push(`Missing or invalid "love" field`)
    }
    if (typeof data.data[0].date !== 'string') {
      errors.push(`Missing or invalid "date" field`)
    }

    return { isValid: errors.length === 0, errors }
  }

  const fetchForums = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get<ForumResponse>(`${BASE_URL}/api/v1/forums`)
      setRawResponse(data)

      console.table(data.data)
      console.table({length:data.length})
      console.log(data)

      const { isValid, errors } = validateApiResponse(data)
      if (!isValid) {
        setError(`Data validation failed: ${errors.join(', ')}`)
        return
      }
      setForums(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!search) return fetchForums()

    try {
      setIsLoading(true)
      const { data } = await axios.get(`${BASE_URL}/api/v1/forums/${search}`)

      const { isValid, errors } = validateApiResponse({ data: [data] })
      if (!isValid) {
        setError(`ข้อมูลไม่ถูกต้อง: ${errors.join(', ')}`)
        return
      }

      setForums({
        data: [data],
        length: 1
      })
      setError(null)
    } catch (err) {
      setForums({ data: [], length: 0 })
      setError(`ไม่พบข้อมูล Forum ID: ${search}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForum = async () => {
    try {
      if (!formData.author || !formData.detail) {
        setError('กรุณากรอกข้อมูลให้ครบทุกช่อง')
        return
      }

      const newPost = {
        ...formData,
        love: 0,
      }

      await axios.post(`${BASE_URL}/api/v1/forums`, newPost)

      await fetchForums()
      setIsCreating(false)
      setFormData({ author: '', detail: '' })
      setError(null)
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการสร้างโพสต์')
    }
  }

  const handleLike = async (postId: number) => {
    try {
      await axios.patch(`${BASE_URL}/api/v1/forums/${postId}/love`);

    } catch (error) {
      console.error('Like error:', error);
      throw error;
    }
  };

  const handleEdit = async (postId: number, newAuthor: string, newDetail: string) => {
    try {
      await axios.put(`${BASE_URL}/api/v1/forums/${postId}`, {
        author: newAuthor,
        detail: newDetail
      });

      await fetchForums()

    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/forums/${postId}`);

      await fetchForums()
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    fetchForums()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="sticky top-0 bg-black text-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">J Forum</span>
            </div>
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาโดย ID..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full 
                      border-2 border-gray-400 border-t-transparent"/>
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchForums}
                className="hover:text-gray-300 transition-colors"
              >
                รีเฟรช
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full 
            flex items-center gap-2 transition-colors"
              >
                <PlusCircleIcon className="h-5 w-5" />
                สร้างโพสต์
              </button>
            </div>
          </div>
        </div>
      </nav>


      <div className="pt-8 pb-4">
        {isLoading && (
          <div className="text-center text-gray-500 mt-8">Loading...</div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border mx-auto max-w-3xl border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{error}</p>

            <div className="mt-4">
              <p className="text-sm font-semibold">ข้อมูลที่ได้รับมา:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold">โครงสร้างที่ถูกต้อง:</p>
              <pre className="bg-blue-50 p-3 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(
                  {
                    length: 1,
                    data: [
                      {
                        id: 1,
                        author: "OSP101",
                        detail: "I like the JavaScript framework called Next.JS.",
                        love: 1000,
                        date: "2025-02-10T17:00:00.000+00:00"
                      }
                    ]
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <ForumPage
            data={forums.data}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold mb-4">สร้างโพสต์ใหม่</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ผู้เขียน</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">เนื้อหา</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg h-32"
                    value={formData.detail}
                    onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => { setIsCreating(false), setFormData({ author: '', detail: '' }) }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleCreateForum}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              flex items-center gap-2"
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                    สร้างโพสต์
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-4 pt-3 border-t-1 border-gray-100 text-center">
          <div className="flex justify-center gap-3 mb-2 mt-2">
            <Image src={'https://spring.io/img/spring.svg'} width={25} height={30} alt="spring logo" />
            <Image src={'/next.svg'} width={60} height={30} alt="next logo" />
            <Image src={'/tailwindcss.svg'} width={30} height={30} alt="tailwind logo" />
          </div>
          <p className="text-xs ">Developed by OSP101 | Powered by Spring Boot + Next.JS + TailwindCSS</p>
          <p className="text-xs ">Teaching media for SC363204 Java Web Application Development. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
