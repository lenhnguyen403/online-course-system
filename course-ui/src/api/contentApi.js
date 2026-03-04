import { axiosClient } from '../utils/axiosClient'

export const getCourseModules = (courseId) =>
  axiosClient.get(`/courses/${courseId}/modules`).then((res) => res.data)

export const getLesson = (courseId, lessonId) =>
  axiosClient.get(`/courses/${courseId}/lessons/${lessonId}`).then((res) => res.data)

export const getMyProgressByCourse = (courseId) =>
  axiosClient.get(`/me/progress/courses/${courseId}`).then((res) => res.data)

export const getMyLessonProgress = (lessonId) =>
  axiosClient.get(`/me/progress/lessons/${lessonId}`).then((res) => res.data)

export const updateLessonProgress = (lessonId, body) =>
  axiosClient.post(`/me/progress/lessons/${lessonId}`, body).then((res) => res.data)

export const markLessonCompleted = (lessonId) =>
  axiosClient.post(`/me/progress/lessons/${lessonId}/complete`).then((res) => res.data)
