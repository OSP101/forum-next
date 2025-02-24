'use client'
import { useState, useEffect } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea
} from '@heroui/react'
import axios from 'axios'
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface EditModalProps {
    forum: {
        id: number
        author: string
        detail: string
        love: number
        date: Date
    }
    onClose: () => void
    refresh: () => void
}

export default function EditModal({ forum, onClose, refresh }: EditModalProps) {
    const [editForums, setEditForums] = useState(forum)
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await axios.put(`${BASE_URL}/api/v1/forums/${editForums.id}`, {
                author: editForums.author,
                detail: editForums.detail,
                love: editForums.love
            })
            refresh()
            onClose()
        } catch (error) {
            console.error('Error updating customer:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal isOpen={!!forum} onClose={onClose} className={kanit.className}>
            <ModalContent className="bg-white p-6 rounded-xl">
                <ModalHeader className="text-2xl font-bold text-purple-600">
                    Edit Forum
                </ModalHeader>
                <ModalBody className="space-y-4">
                    <Input
                        label="Author"
                        variant="bordered"
                        value={editForums.author}
                        onValueChange={(val) => setEditForums({ ...editForums, author: val })}
                    />
                    <Textarea
                        label="Detail"
                        variant="bordered"
                        value={editForums.detail}
                        onValueChange={(val) => setEditForums({ ...editForums, detail: val })}
                    />

                    <Input
                        label="Love"
                        variant="bordered"
                        value={editForums.love.toString()}
                        onValueChange={(val) => setEditForums({ ...editForums, detail: val })}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="default"
                        variant="light"
                        onPress={onClose}
                        className="hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        onPress={handleSave}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
