package com.supermap.itablet.bundleCore;

import org.json.JSONObject;

/**
 * @Author: shanglongyang
 * Date:        7/21/22
 * project:     iTablet
 * package:     iTablet
 * class:
 * description: bundle 信息
 */
public class BundleBean {
    private String name;
    private String path;
    private String create_date;
    private String md5;
    private String version;
    private String author;
    private String bundleType;

    public BundleBean() {}

    public BundleBean(JSONObject object) {
        try {
            if (object.has("name")) {
                setName(object.getString("name"));
            }
            if (object.has("bundleType")) {
                setBundleType(object.getString("bundleType"));
            }
            if (object.has("path")) {
                setPath(object.getString("path"));
            }
            if (object.has("create_date")) {
                setCreate_date(object.getString("create_date"));
            }
            if (object.has("md5")) {
                setMd5(object.getString("md5"));
            }
            if (object.has("version")) {
                setVersion(object.getString("version"));
            }
            if (object.has("author")) {
                setAuthor(object.getString("author"));
            }
        } catch (Exception e) {

        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBundleType() {
        return bundleType;
    }

    public void setBundleType(String bundleType) {
        this.bundleType = bundleType;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getCreate_date() {
        return create_date;
    }

    public void setCreate_date(String create_date) {
        this.create_date = create_date;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
