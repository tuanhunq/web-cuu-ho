-- Create database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'rescue')
BEGIN
    CREATE DATABASE rescue;
END
GO

USE rescue;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
        [Email] NVARCHAR(255) NOT NULL UNIQUE,
        [Password] NVARCHAR(255) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        [Phone] NVARCHAR(20) NOT NULL,
        [Role] NVARCHAR(20) NOT NULL DEFAULT 'user',
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        [UpdatedAt] DATETIME DEFAULT GETDATE()
    );
END
GO

-- Create Teams table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Teams]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Teams] (
        [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
        [Name] NVARCHAR(100) NOT NULL,
        [Phone] NVARCHAR(20) NOT NULL,
        [Status] NVARCHAR(20) NOT NULL DEFAULT 'available',
        [Latitude] DECIMAL(10, 8) NOT NULL,
        [Longitude] DECIMAL(11, 8) NOT NULL,
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        [UpdatedAt] DATETIME DEFAULT GETDATE()
    );
END
GO

-- Create RescueRequests table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RescueRequests]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RescueRequests] (
        [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [TeamId] UNIQUEIDENTIFIER,
        [Status] NVARCHAR(20) NOT NULL DEFAULT 'pending',
        [Description] NVARCHAR(MAX) NOT NULL,
        [ServiceType] NVARCHAR(50) NOT NULL,
        [Latitude] DECIMAL(10, 8) NOT NULL,
        [Longitude] DECIMAL(11, 8) NOT NULL,
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        [UpdatedAt] DATETIME DEFAULT GETDATE(),
        FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
        FOREIGN KEY ([TeamId]) REFERENCES [Teams]([Id])
    );
END
GO

-- Create RescueNotes table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RescueNotes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RescueNotes] (
        [Id] UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
        [RescueRequestId] UNIQUEIDENTIFIER NOT NULL,
        [UserId] UNIQUEIDENTIFIER NOT NULL,
        [Content] NVARCHAR(MAX) NOT NULL,
        [CreatedAt] DATETIME DEFAULT GETDATE(),
        FOREIGN KEY ([RescueRequestId]) REFERENCES [RescueRequests]([Id]),
        FOREIGN KEY ([UserId]) REFERENCES [Users]([Id])
    );
END
GO