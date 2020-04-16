const {Router} = require('express')
const {validationResult} = require('express-validator')

const Course = require('../models/course')
const auth = require('../middleware/auth')
const {courseValidators} = require('../utils/validators')

const router = Router()

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const dbcourses = await Course.find()
    	.populate('userId')
      .select('price title img')
    
    const courses = dbcourses.map(data => ({
      ...data._doc,
      userId: data.userId ? {...data.userId._doc} : null
    }))

    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses
    })
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {
    const data = await Course.findById(req.params.id)
    const course = {...data._doc}

    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }

    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      course
    })
  } catch (e) {
    console.log(e)
  }
})

router.post('/edit', auth, courseValidators, async (req, res) => {
  
  const errors = validationResult(req)
  const {id} = req.body

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
  }

  try {
    delete req.body.id

    const course = await Course.findById(id)

    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }

    Object.assign(course, req.body)
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id
    })
    res.redirect('/courses')
  } catch (e) {
    console.log(e)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const data = await Course.findById(req.params.id) 
    const course = {...data._doc}

    res.render('course', {
      layout: 'empty',
      title: `Курс ${course.title}`,
      course
    })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
