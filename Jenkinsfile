/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    tools {
        nodejs 'NodeJS 18'
    }
    environment {
        FRONTEND_IMAGE = 'allanbinga/pioneer-writers-frontend:v2.0.0'
        BACKEND_IMAGE  = 'allanbinga/pioneer-writers-backend:v2.0.0'
        DOCKER_CREDS = credentials('dockerhub') // stored securely in Jenkins
    }
    stages {
        stage('Clone Repository') {
            steps {
                //Clone Repo
                git 'https://github.com/Allan-Binga/Pioneer-Writers'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        // stage('Build Docker Images') {
        //     steps {
        //         script {
        //             sh "docker build -t $FRONTEND_IMAGE ./client"
        //             sh "docker build -t $BACKEND_IMAGE ."
        //         }
        //     }
        // }

        // stage('Login to DockerHub') {
        //     steps {
        //         sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
        //     }
        // }

        // stage('Push Docker Images') {
        //     steps {
        //         sh "docker push $FRONTEND_IMAGE"
        //         sh "docker push $BACKEND_IMAGE"
        //     }
        // }
    }
    post {
        success {
            slackSend(
                channel: '#pioneer-writers',
                color: 'good',
                message: "Docker images built and pushed:\n- $FRONTEND_IMAGE\n- $BACKEND_IMAGE"
            )
        }
        failure {
            slackSend(
                /* groovylint-disable-next-line DuplicateStringLiteral */
                channel: '#pioneer-writers',
                color: 'danger',
                message: 'Jenkins pipeline failed. Check the console output.'
            )
        }
    }
}
