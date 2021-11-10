
#!/bin/bash

sudo su -

curl https://raw.githubusercontent.com/isman-usoh/eth-node-healthcheck/master/eth-node-healthcheck-linux-x64 --output /usr/bin/eth-node-healthcheck-linux-x64
curl https://raw.githubusercontent.com/isman-usoh/eth-node-healthcheck/master/services/eth-node-healthcheck.service --output /etc/systemd/system/eth-node-healthcheck.service
chmod +x /usr/bin/eth-node-healthcheck-linux-x64

systemctl daemon-reload
systemctl enable eth-node-healthcheck.service
systemctl start eth-node-healthcheck.service
systemctl status eth-node-healthcheck.service
