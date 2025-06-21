/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    tools {
         nodejs 'NodeJS 18' 
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
    // stage ('Run Tests') {
    //     steps {
    //         sh 'npm test'
    //     }
    // }
    }
    post {
        success {
            slackSend(
                channel: '#pioneer-writers',
                color: 'good',
                message: 'Successfully installed dependencies.'
            )
        }
        failure {
            slackSend(
                channel: '#pioneer-writers',
                color: 'danger',
                message: 'Failed to install dependencies.'
            )
        }
    }
}
