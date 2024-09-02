import { currentUser } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, isPublished: true }
    })

    if (!course) {
      return new NextResponse('Course not found!', { status: 404 })
    }

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: params.courseId } },
    })

    if (enrollment) {
      return new NextResponse('Already enrolled', { status: 400 })
    }

    // Create a new enrollment
    await db.enrollment.create({
      data: {
        userId: user.id,
        courseId: params.courseId,
      }
    })

    return NextResponse.json({
      message: 'Enrolled successfully',
      courseId: course.id
    })
  } catch (error) {
    console.error('Enrollment error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
