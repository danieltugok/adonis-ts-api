import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'
import Application from '@ioc:Adonis/Core/Application'
import {v4 as uuidv4} from 'uuid'

export default class MomentsController {

  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  //Search for all
  public async index({}: HttpContextContract) {
    const moments = await Moment.all()
    return {
      data: moments,
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()
    const image = request.file('image', this.validationOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)

    response.status(201)

    return {
      message: 'success',
      data: moment,
    }
  }

  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    return {
      data: moment,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const moment = await Moment.findOrFail(params.id)

    moment.title = body.title
    moment.description = body.description

    if (moment.image !== body.image || !moment.image) {
      const image = request.file('image', this.validationOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`
        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })
        moment.image = imageName
      }
    }

    await moment.save()
    return {
      message: 'success',
      data: moment,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()

    return {
      message: 'success',
      data: moment,
    }
  }
}
