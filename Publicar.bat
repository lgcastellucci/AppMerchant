@echo off

call ng build --configuration testing --base-href /hml-app_merchant-ng/ --output-path dist/hml-app_merchant-ng

robocopy /MIR dist\hml-app_merchant-ng\browser w:\NginxCas_data\_data\hml-app_merchant-ng\

rmdir /S/Q dist

call ng build --configuration production --base-href /app_merchant-ng/ --output-path dist/app_merchant-ng

robocopy /MIR dist\app_merchant-ng\browser w:\NginxCas_data\_data\app_merchant-ng\

rmdir /S/Q dist

timeout /t 30
