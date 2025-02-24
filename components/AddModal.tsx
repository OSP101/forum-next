'use client'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@heroui/react'
import { useState } from 'react'
import axios from 'axios'
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function AddModal({ isOpen, onOpenChange, refresh }: any) {
  const [newForum, setNewForum] = useState({ author: '', detail: '', love: '' })

  const handleSubmit = async () => {
    await axios.post(`${BASE_URL}/api/v1/forums`, newForum)
    refresh()
    onOpenChange(false)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className={kanit.className}>
      <ModalContent className="bg-white p-6 rounded-xl">
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl font-bold text-blue-600">
              Add New Forum
            </ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Author"
                variant="bordered"
                value={newForum.author}
                onValueChange={(val) => setNewForum({ ...newForum, author: val })}
              />
              <Textarea
                label="Detail"
                variant="bordered"
                value={newForum.detail}
                onValueChange={(val) => setNewForum({ ...newForum, detail: val })}
              />

              <Input
                label="Love"
                variant="bordered"
                type='number'
                value={newForum.love}
                onValueChange={(val) => setNewForum({ ...newForum, love: val })}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                onPress={handleSubmit}
              >
                Add Forum
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
