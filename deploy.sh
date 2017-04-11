#ng build --prod --aot
#scp -r -i "~/.ssh/for_APAR.pem" server* ec2-user@54.251.188.71:/home/ec2-user/elite3/
#scp -r -i "~/.ssh/for_APAR.pem" dist ec2-user@54.251.188.71:/home/ec2-user/elite3/
scp -r -i "~/.ssh/for_APAR.pem" build.zip ec2-user@54.251.188.71:/home/ec2-user/elite3/
