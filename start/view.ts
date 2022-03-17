import View from '@ioc:Adonis/Core/View'
import { IMG_PLACEHOLDER } from 'Config/drive'

View.global('getImage', (imagePath: string) => imagePath ?? IMG_PLACEHOLDER)
