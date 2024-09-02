import { Attachment, Chapter } from '@prisma/client'
import { db } from '@/lib/db'

type GetChapterArgs = {
  userId: string
  courseId: string
  chapterId: string
}

export async function getChapter({ userId, courseId, chapterId }: GetChapterArgs) {
  try {
    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } }
    })
    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true }
    })
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, isPublished: true }
    })

    if (!chapter || !course) {
      throw new Error('Chapter or course not found!')
    }

    let muxData = null
    let attachments: Attachment[] = []
    let nextChapter: Chapter | null = null

    if (enrollment) {
      attachments = await db.attachment.findMany({ where: { courseId } })
    }

    if (chapter.isFree || enrollment) {
      muxData = await db.muxData.findUnique({ where: { chapterId } })

      nextChapter = await db.chapter.findFirst({
        where: { courseId, isPublished: true, position: { gt: chapter.position } },
        orderBy: { position: 'asc' },
      })
    }

    const userProgress = await db.userProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } }
    })

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      enrollment,
    }
  } catch {
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: null,
      nextChapter: null,
      userProgress: null,
      enrollment: null,
    }
  }
}
