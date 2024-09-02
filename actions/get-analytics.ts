import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

type EnrollmentWithCourse = Prisma.EnrollmentGetPayload<{ include: { course: true } }>

function groupByCourse(enrollments: EnrollmentWithCourse[]) {
  const grouped: { [courseTitle: string]: number } = {}

  enrollments.forEach((enrollment) => {
    const courseTitle = enrollment.course.title
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0
    }

    grouped[courseTitle] += 1 // Count enrollments
  })

  return grouped
}

export async function getAnalytics(userId: string) {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { course: { createdById: userId } },
      include: { course: true },
    })

    const groupedEnrollments = groupByCourse(enrollments)
    const data = Object.entries(groupedEnrollments).map(([courseTitle, count]) => ({
      name: courseTitle,
      total: count,
    }))

    const totalEnrollments = enrollments.length
    const totalCourses = new Set(enrollments.map(e => e.courseId)).size

    return {
      data,
      totalEnrollments,
      totalCourses,
    }
  } catch (error) {
    console.error('Error in getAnalytics:', error)
    return {
      data: [],
      totalEnrollments: 0,
      totalCourses: 0,
    }
  }
}
