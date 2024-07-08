Create table EmployeeDetails (
employee_id int identity(1,1) Primary Key,
employee_name varchar(125) not null,
password varchar(125) not null,
email_address varchar(175) not null,
is_admin bit default 0,
created_at datetime default getDate(),
modified_at datetime default getDate(),
is_active bit default 1
)

Create table BikeDetails (
bike_id int identity(1,1) Primary Key,
bike_name varchar(50) not null,
assembly_hours int not null,
assembly_minutes int not null,
created_at datetime default getDate(),
modified_at datetime default getDate(),
is_active bit default 1
)

Create table BikeAssemblyDetails (
assembly_map_id int identity(1,1) Primary Key,
employee_id int foreign key references EmployeeDetails(employee_id),
bike_id int foreign key references BikeDetails(bike_id),
status varchar(15),
created_at datetime default getDate(),
modified_at datetime default getDate(),
is_active bit default 1
)
