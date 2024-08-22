const mongoose = require('mongoose')

if (process.argv.length <= 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const password = process.argv[2]

      if(process.argv.length >= 3){
        const url =
        `mongodb+srv://prietoeiderREACTfullstack:${password}@clusterreactlearning.lqc9r.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=ClusterREACTLearning`

        mongoose.set('strictQuery',false)

        mongoose.connect(url)

        const phoneSchema = new mongoose.Schema({
            name: String,
            number: String,
          })
          
        const Phonebook = mongoose.model('Phonebook', phoneSchema)
        
        const Phone = new Phonebook({
            name: `${name}`,
            number: `${number}`,
        })

        if(process.argv.length === 3){
            Phonebook.find({}).then(result => {
                console.log('Phonebook:')
                result.forEach(note => {
                console.log(note.name , note.number)
                })
                mongoose.connection.close()
            })
        }
        else if(process.argv.length === 5){
            Phone.save().then(result => {
                console.log(`added ${name} number ${number} to phonebook`)
                mongoose.connection.close()
              })
        }
        else if(process.argv.length === 4){
            console.log('you\'re missing the telephone number')
            mongoose.connection.close()
            process.exit(1)
        }    
      }
      else{
          console.log('you\'re missing password')
          mongoose.connection.close()
          process.exit(1)  
      }
    }
else{
    console.log('you\'re placing more informacion')
    process.exit(1)
}
