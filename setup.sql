create database planner;
use planner;
create table account_list (id int auto_increment primary key, username varchar (30), password varchar (30));
create table color_list (id int auto_increment primary key, value varchar (7));
insert into color_list set value = '#ffaeab';
insert into color_list set value = '#ffda94';
insert into color_list set value = '#fff782';
insert into color_list set value = '#dbff87';
insert into color_list set value = '#87ffa5';
insert into color_list set value = '#80ffd9';
insert into color_list set value = '#94e7ff';
insert into color_list set value = '#a8beff';
insert into color_list set value = '#c1a8ff';
insert into color_list set value = '#ffa8fc';
create table domain_list (id int auto_increment primary key, account int, title varchar (30), color int, active tinyint);
create table session_list (account int, code varchar (10), last_active int);
create table slot_list (id int auto_increment primary key, account int, slot int, domain int, active tinyint);
create table task_list (id int auto_increment primary key, domain int, description varchar (60), active tinyint);
