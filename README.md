# Deploying and Running a Full Stack Web Application in AWS using Elastic Beanstalk. 

This is a simple web application for creating a user registration form and deploying using AWS Elastic Beanstalk. 

This web app is created using React for the Front End and NodeJS for the API's. There are two API's. The first API updates the User Registration information to DynamoDB and the second one publishes an email to the subscribed SNS topic. The SNS topic is susbscribed by Elastic Beanstalk during the creation. The DynamoDB Database is created by using AWS CDK(Cloud Deployment Kit).

![arch](/images/beanstalk-workshop-arch.png) 

_Please follow the below steps to deploy this app to AWS._

## Development Environment Setup:

1. Install and configure the AWS CLI as per https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
2. Install EB CLI as per the AWS Documentation - https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html
3. Install CDK by running 'npm install -g aws-cdk' in the terminal
4. Clone this entire source code

  ## Setup Database, ECR and Elsatic Beanstalk IAM roles using CDK.  

1. 'cd userreg-api-node-beanstalk/cdk'
1. Run 'npm install'
1. Run 'npm run build'
1. Run 'cdk synth'
1. Run 'cdk deploy'

## React App Setup and Deployment

1. 'cd userreg-react-beanstalk'
2. Install the node dependencies by running 'npm install'
3. 'npm run start-local' - This would initilaize and run the application in localhost:3000. Go to the browser and check if the application is up and running. An user registration form should show up.
4. Run 'eb init' - This would initialize the applciation in your AWS Account. Select the Appropriate Region and Application Name. Enter "Y" for Node.js question and select the platform branch. You could opt No for CodeCommit and either create or select an existing kep pair for SSH.
5. Run 'eb create' - This command would create the environment for your Elastic Beanstalk Application. Enter the environment name and DNS CNAME prefix and chose Application type as your load balancer. You could choose to enable spot fleet requests. This would create your environment.
6. 'eb open' would open the web application in your default browser. 
7. You could come back to this and update the .env file after creating the API's in the upcoming steps


## NodeJS API's setup and deployment using elastic beanstalk multiple docker

### Setup, containerize and upload the docker image of the service that updates the user information to DynamoDB

1. 'cd api-db'
2. Run 'aws ecr get-login-password --region <aws-region> | docker login --username AWS --password-stdin <xxxx.dkr.ecr.xxxxxx.amazonaws.com>' Update the region and ECR URL accordingly (Please check https://docs.aws.amazon.com/cli/latest/reference/ecr/get-login-password.html)
3. Run 'docker build -t user-reg-db .'
4. docker tag user-reg-db:latest <ecr-repo-uri-userregsnsxxx>:latest (https://docs.docker.com/engine/reference/commandline/tag/)
5. docker push <ecr-repo-uri-userregsnsxxx>:latest


### Setup, containerize and upload the docker image of the service that sends that publishes the email through SNS topic

1. 'cd api-sns'
2. opne the file 
2. Run 'aws ecr get-login-password --region <aws-region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<aws-region>.amazonaws.com' Update the region and ECR URL accordingly (Please check https://docs.aws.amazon.com/cli/latest/reference/ecr/get-login-password.html)
3. Run 'docker build -t user-reg-sns .'
4. docker tag user-reg-sns:latest <ecr-repo-uri-userregsnsxxx>:latest (https://docs.docker.com/engine/reference/commandline/tag/)
5. docker push  <ecr-repo-uri-userregsnsxxx>:latest

The above steps builds the containers of the services  and pushes the image to AWS ECR

### Create a Multi Docker Elastic BeanStalk Application that hosts the above two services as containers, whose images are hosted in ECR

1. 'cd multi-docker'
2. open '.ebextensions/settings.config' in an editor and update NewSignupEmail to an email that you could recieve emails to. This is the email that your SNS topic would be subscribed to.
3. open 'Dockerrun.aws.json' and update the image URI's(image value in container definitions) for the two services. This would be the ECR Image URI's that was created in the previous steps.
4. Run 'eb init'. Select the region, application. Input 'Y' for Docker question and select Multi-Container Docker option
5. Run 'eb create' Select an environment, DNS name and select Application as load balancer. This would create the multi docker application
6. Once the environment is created, a subscription confirmation email would be sent to the email address udpated in step 2.

### Update the .env file in react app for connecting with the containerized services

1. 'cd userreg-react-beanstalk'
2. open the '.env' file and update the values of xxxxxxx with the DNS CNAME of the multi docker service created in the previous step(Please note that the URL's would be the same for both the services as they are deployed as docker containers in the same instance. This to enable extensibility in case if the services are deployed in different instances).
3. Run 'eb deploy'

###  Test the app 

Once the react app is deployed, run 'eb open' and test the app by entering the values in the form and hit register.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

