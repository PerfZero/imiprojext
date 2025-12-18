#!/bin/bash

SERVER_IP="79.174.77.143"
SERVER_USER="root"
SERVER_PASS="3kjA70rMecWhsh9i"

ssh_command() {
    sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER_USER@$SERVER_IP" "$1"
}

echo "Проверка подключения к серверу..."
ssh_command "echo 'Подключение успешно' && uname -a"

echo "Проверка установленных пакетов..."
ssh_command "which nginx || echo 'nginx не установлен'"
ssh_command "which node || echo 'node не установлен'"
ssh_command "which pm2 || echo 'pm2 не установлен'"
ssh_command "which git || echo 'git не установлен'"

echo "Проверка структуры проекта..."
ssh_command "ls -la /root/imiprojext 2>/dev/null || echo 'Проект не найден'"
