'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Button } from '@/components/ui/button'
// import { formatPrice } from '@/lib/format'

type CourseEnrollButtonProps = {
  courseId: string
}

export default function CourseEnrollButton({ courseId }: CourseEnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`/api/courses/${courseId}/enroll`)
      window.location.assign(response.data.url)
    } catch (error) {
      toast.error('Something went wrong!')
      console.error('Enrollment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-full md:w-auto" size="sm" onClick={onClick} disabled={isLoading}>
      Enroll in Course
    </Button>
  )
}
