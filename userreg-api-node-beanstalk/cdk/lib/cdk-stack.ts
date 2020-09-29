// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ecr from '@aws-cdk/aws-ecr';
import { Role, ServicePrincipal, ManagedPolicy, CfnInstanceProfile } from '@aws-cdk/aws-iam';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const table = new dynamodb.Table(this, 'signup', {
      partitionKey: { 
        name: 'email', 
        type: dynamodb.AttributeType.STRING 
      },
      tableName: 'signup',
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to 
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const ecrRepo = new ecr.Repository(this, 'user-reg-db');

    const ecrRepoSNS = new ecr.Repository(this, 'user-reg-sns');

    const beanstalkEC2Instancerole = new Role(this, 'aws-elasticbeanstalk-ec2-role', {
      assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      roleName: 'aws-elasticbeanstalk-ec2-role'
    });
    beanstalkEC2Instancerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryFullAccess'));
    beanstalkEC2Instancerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));
    beanstalkEC2Instancerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'));
    beanstalkEC2Instancerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkMulticontainerDocker'));
    beanstalkEC2Instancerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWorkerTier'));
    beanstalkEC2Instancerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSNSFullAccess'));

    const beanstalkEC2Instance = new CfnInstanceProfile(this, "InstanceProfile", {
      roles: [beanstalkEC2Instancerole.roleName],
      instanceProfileName: 'aws-elasticbeanstalk-ec2-role'
    });

    const beanstalkServicerole = new Role(this, 'aws-elasticbeanstalk-service-role', {
      assumedBy: new ServicePrincipal('elasticbeanstalk.amazonaws.com'),
      roleName: 'aws-elasticbeanstalk-service-role'
    });
    beanstalkServicerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSElasticBeanstalkEnhancedHealth'));
    beanstalkServicerole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSElasticBeanstalkService'));

  }
}
