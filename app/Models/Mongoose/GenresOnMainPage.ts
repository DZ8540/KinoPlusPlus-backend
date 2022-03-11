import Genre from '../Genre'
import Mongoose, { Schema } from '@ioc:Mongoose'

export interface GenreOnMainPage {
  genreId: Genre['id'],
}

export default Mongoose.model<GenreOnMainPage>('GenreOnMainPage',
  new Schema<GenreOnMainPage>({
    genreId: {
      type: Number,
      required: true,
      index: true,
      unique: true,
    },
  })
)
