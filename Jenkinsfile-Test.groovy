pipeline {
    agent {
        dockerfile {
            filename 'docker/dockerfile-node'
            additionalBuildArgs '--build-arg JENKINS_USER_ID=`id -u jenkins` --build-arg JENKINS_GROUP_ID=`id -g jenkins`'
        }
    }

    environment {
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')

        VUE_APP_API_URL = "https://api.epaper.opendatahub.testingmachine.eu"

        VUE_APP_KEYCLOAK_URL = "https://auth.opendatahub.testingmachine.eu/auth"
        VUE_APP_KEYCLOAK_REALM = "noi"
        VUE_APP_KEYCLOAK_CLIENT_ID = "it.bz.opendatahub.epaper.web"
        VUE_APP_KEYCLOAK_RESOURCE_CLIENT_ID = "it.bz.opendatahub.epaper.api"
    }

    stages {
        stage('Dependencies') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Build') {
            steps {
                sh 'yarn run build'
            }
        }
        stage('Upload') {
            steps {
                s3Upload(bucket: 'epaper-test', acl: 'PublicRead', file: './dist')
            }
        }
    }
}
