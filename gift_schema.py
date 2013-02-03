class User:
    # first we need a user model with relevant user
    # information (password, username, friends, etc)
    username = CharField()
    password = HashedCharfield()
    # we should not be storing the user's password in plain text


class Gift:
    # for our gift class, we'l have description and price,
    # as well as if it has been bought for the user or not.
    name = CharField()
    description = CharField()
    price = FloatField(round=2)
    bought = BooleanField()
    user = ForeignKey(to=User)  # one user can have many gifts,
    # but one gift can also have many users that want it.

# SQL for the user flow:
# 1.    INSERT INTO gifts (5, 'Beanbag Chair', 'The cutting edge chair for comfort and relaxation.', 45.98, 0, 7)
        ############## gift id, gift name,       gift description,                          gift price, bought, user id

# 2     (assuming we have the user id of the user currently logged in (e.g., 8))    
#       SELECT * FROM gifts g WHERE g.user_id <> 8

# 3.    (assuming we have the gift id (e.g., 7) that we want to buy)
#       UPDATE gifts SET bought=0 WHERE id=7

## AFTER THE MIGRATION ##

class User:
    username = CharField()
    password = HashedCharfield()
    friends = OneToMany(to=User)  # one user can have many users as friends


class Gift:
    name = CharField()
    description = CharField()
    price = FloatField(round=2)
    bought = BooleanField() # we keep this field called 'bought' to reduce trouble with migrations
    # we could call it 'fulfilled', but we would run into problems when we migrate the database and
    # all the gifts were suddenly 'fullfilled' or not 'fulfilled', depending on the default value we
    # set during the migration. 
    user = ForeignKey(to=User)


class Contribution:
    value = FloatField()
    gift = ForeignKey(to=Gift)  #one gift can have many contributions.
    user = ForeignKey(to=User)  #one user can have many contributions
    # on the addition of a contribution to the database, we will check if
    # the total value of all the contributions for the gift are enough to pay
    # for the gift, and if so, set bought = True.

# Since there are a fairly low number of users, I would first export the database
# just in case something goes wrong during migration.
# Assuming you have this schema in the models.py of a django app, you can easily
# user django-south to migrate the schema - it would be as simple as
# ./manage.py migrate gifts
# assuming the app is called 'gifts'.

# You could in theory implement the transition with no downtime by creating a whole
# new array of database servers, transferring the data you already have to those
# new servers, and then flipping the queries to go to the new database using some
# kind of job manager program, but seeing as it's 1995 and you're still working with
# only your friends and your mom's book club, you probably don't have the resources
# to pay for those extra servers.
