@echo off

set current_date=%date:~0,2%-%date:~3,2%-%date:~6,4%

copy C:\CantinaCharis\cantina.db "C:\CantinaCharis\backup_db\database_db_%current_date%" /y