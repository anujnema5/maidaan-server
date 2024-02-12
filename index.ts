import {app} from '@/app'
import 'dotenv/config'

const PORT = process.env.PORT || 8500

app.listen(PORT, ()=> {
    console.log(`🏏 Turf Server Started at http://localhost:${PORT}/ KHELOO!!⚽ `)
})