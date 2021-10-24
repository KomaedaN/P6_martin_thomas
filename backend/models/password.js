const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(7)                                    
.is().max(50)                                 
.has().uppercase()                              
.has().lowercase()                             
.has().digits()                                
.has().not().spaces() 


module.exports = passwordSchema;