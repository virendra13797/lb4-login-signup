 
  
 

export const CredentialsSchema = {
      type: "object",
    required: ['email','password'],
    properties: {
                 email: {
            type:'string',
            format:'email',
      }, 
        password: {
            type:'string',
            minLength: 8, 
        },
    },
};

 

export const requestBody = {
    discription: "the input of login funtion",
    required: true,
    content: { 
          'application/json':{schema:CredentialsSchema },
    },

};