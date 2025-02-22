import {
    UserCircleIcon,
    PencilIcon,
    TrashIcon
  } from '@heroicons/react/24/outline';
  import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
  import { format } from 'date-fns';
  import { useState, useEffect } from 'react';
  import { AnimatePresence, motion } from 'framer-motion';
  
  interface Post {
    id: number;
    author: string;
    detail: string;
    love: number;
    date: string;
  }
  
  interface ForumProps {
    data: Post[];
    onLike?: (postId: number) => void;
    onEdit?: (postId: number, newAuthor: string, newDetail: string) => Promise<void>;
    onDelete?: (postId: number) => Promise<void>;
  }
  
  const ForumPage: React.FC<ForumProps> = ({ data, onLike, onEdit, onDelete }) => {
    const [localLikes, setLocalLikes] = useState<{ [key: number]: number }>({});
    const [animatingId, setAnimatingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ author: string; detail: string }>({
      author: '',
      detail: ''
    });
  
    const handleLike = async (postId: number) => {
      setLocalLikes(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1
      }));
  
      setAnimatingId(postId);
  
      if (onLike) {
        try {
          await onLike(postId);
        } catch (error) {
          setLocalLikes(prev => ({
            ...prev,
            [postId]: (prev[postId] || 0) - 1
          }));
        }
      }
    };
  
    const handleEditClick = (post: Post) => {
      setEditingId(post.id);
      setEditData({
        author: post.author,
        detail: post.detail
      });
    };
  
    const handleSave = async (postId: number) => {
      if (onEdit && editData.author && editData.detail) {
        try {
          await onEdit(postId, editData.author, editData.detail);
          setEditingId(null);
        } catch (error) {
          console.error('Error saving post:', error);
        }
      }
    };
  
    const handleCancelEdit = () => {
      setEditingId(null);
      setEditData({ author: '', detail: '' });
    };
  
    const handleDelete = async (postId: number) => {
      if (onDelete && confirm('Are you sure to delete this post?')) {
        try {
          await onDelete(postId);
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      }
    };
  
    useEffect(() => {
      if (animatingId) {
        const timer = setTimeout(() => setAnimatingId(null), 500);
        return () => clearTimeout(timer);
      }
    }, [animatingId]);
  
    return (
      <div className="">
        <div className="max-w-2xl mx-auto space-y-4">
          {data.map((post) => {
            const likes = post.love + (localLikes[post.id] || 0);
            const isAnimating = animatingId === post.id;
            const isEditing = editingId === post.id;
  
            return (
              <motion.div
                key={post.id}
                className="bg-white rounded-xl shadow-sm p-4 transition-all hover:shadow-md relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {!isEditing && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600"
                    aria-label="Edit post"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600"
                    aria-label="Delete post"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                )}
  
                <div className="flex items-start gap-3 mb-3">
                  <UserCircleIcon className="h-10 w-10 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        value={editData.author}
                        onChange={(e) => setEditData({...editData, author: e.target.value})}
                        className="text-lg font-semibold border-b-2 border-blue-500 focus:outline-none w-full"
                      />
                    ) : (
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    )}
                    <time className="text-sm text-gray-500">
                      {format(new Date(post.date), "MMM d, yyyy 'at' h:mm a")}
                    </time>
                  </div>
                </div>
  
                {isEditing ? (
                  <textarea
                    value={editData.detail}
                    onChange={(e) => setEditData({...editData, detail: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                    {post.detail}
                  </p>
                )}
  
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2 mt-4"
                    >
                      <button
                        onClick={() => handleSave(post.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
  
                <div className="flex items-center gap-1 text-gray-500">
                  <LikeButton
                    postId={post.id}
                    likes={likes}
                    onLike={handleLike}
                  />
                  <span
                    className={`text-sm ${
                      isAnimating 
                        ? 'animate-[count-up_0.3s_ease-in-out] text-red-600 font-bold' 
                        : 'text-gray-600'
                    }`}
                  >
                    {likes.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    );
  };
  

const LikeButton = ({ postId, likes, onLike }: {
    postId: number
    likes: number
    onLike: (postId: number) => void
}) => {
    const [clickCount, setClickCount] = useState(0)
    const [lastClickTime, setLastClickTime] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleClick = () => {
        const now = Date.now()
        if (now - lastClickTime < 1000) {
            setClickCount(prev => Math.min(prev + 1, 5))
        } else {
            setClickCount(1)
        }
        setLastClickTime(now)
        setIsAnimating(true)
        onLike(postId)
    }

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => setIsAnimating(false), 1000)
            return () => clearTimeout(timer)
        }
    }, [isAnimating])

    const getAnimation = () => {
        switch (clickCount) {
            case 1: return { scale: 1.2 }
            case 2: return { scale: 1.4, rotate: [-5, 5, -5, 5, 0] }
            case 3: return { scale: 1.6, rotate: [0, 360] }
            case 4: return { scale: 1.8, y: [-10, 10, -10, 0] }
            case 5: return { scale: 2, y: [0, -30, 0], rotate: [0, 360] }
            default: return { scale: 1 }
        }
    }

    return (
        <div className="relative">
            <motion.button
                onClick={handleClick}
                animate={isAnimating ? getAnimation() : {}}
                transition={{ duration: 0.5 }}
                className="relative focus:outline-none"
            >
                <HeartSolid className={`h-7 w-7 ${clickCount >= 1 ? 'text-red-500' : 'text-gray-500'
                    } transition-colors`} />

                <AnimatePresence>
                    {clickCount > 1 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            {[...Array(clickCount - 1)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute text-2xl"
                                    style={{
                                        rotate: i * (360 / (clickCount - 1)),
                                        color: ['#FF0000', '#FF6B6B', '#FFAAAA'][i % 3]
                                    }}
                                >
                                    ❤️
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}

export default ForumPage;